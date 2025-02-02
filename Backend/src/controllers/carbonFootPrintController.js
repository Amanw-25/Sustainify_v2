import { CarbonFootprint } from "../models/index.js";
import { User } from "../models/index.js";
import { spawn } from "child_process";

const validateFields = (fields, requiredFields) => {
  for (const field of requiredFields) {
    if (fields[field] === undefined || fields[field] === null) {
      return `Field "${field}" is required.`;
    }
  }
  return null;
};

export const calculateCarbonFootprint = async (req, res) => {
  const id = req.userId;

  if (!id) {
    return res.status(404).json({
      status: "failed",
      message: "User_id not found",
    });
  }

  const requiredFields = [
    "Petrol",
    "Diesel",
    "Electricity",
    "NaturalGas",
    "CNG",
    "Flight",
    "LPG",
    "FuelOil",
    "Coal",
    "OrganicWaste",
    "PaperWaste",
    "PlasticWaste",
    "WaterUsage",
    "PublicTransportUsage",
  ];

  const validationError = validateFields(req.body, requiredFields);
  if (validationError) {
    return res.status(400).json({
      status: "failed",
      message: validationError,
    });
  }

  try {
    const CarbonData = await CarbonFootprint.calculate(req.body);

    const carbonFootprint = new CarbonFootprint({
      ...CarbonData,
      user: id,
    });

    const savedCarbonFootprint = await carbonFootprint.save();

    await User.findByIdAndUpdate(
      id,
      { $push: { carbonFootprint: savedCarbonFootprint._id } },
      { new: true }
    );

    const updatedUser = await User.findById(id).populate("carbonFootprint");

    return res.status(200).json({
      message: "Carbon footprint calculated and saved successfully",
      carbonFootprint: savedCarbonFootprint,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const chatWithMistralAI = async (req, res) => {
  try {
    const carbonData = await CarbonFootprint.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!carbonData || carbonData.length === 0) {
      return res
        .status(404)
        .json({ error: "Carbon footprint data not found for the user." });
    }

    const messageContent = `
    Analyze the following carbon footprint data and provide a response STRICTLY in the following format. DO NOT include any introductory text or conclusion:

    1. Key Insights:
    - First insight about overall carbon footprint from provided data
    - Second insight about primary areas of concern from provided data  
    - Third insight about notable patterns
    - Identify the top 3 contributors with exact percentages
    - Highlight any unusual or concerning consumption patterns
    - Note any immediate red flags in consumption patterns

    2. Actionable Tips:
    - Provide a high-impact action targeting the largest emission source
    - Suggest a cost-effective solution with estimated savings
    - Recommend a technology-based solution for monitoring/reducing emissions
    - Propose a behavioral change with quantified potential impact
    - Suggest a community or workplace-based initiative

    3. Main Contributor Analysis:
    - Detailed analysis of the highest emission source
    - Specific impact of this contributor
    - Direct suggestions for reduction
    - Compare this with standard benchmarks
    - Provide specific reduction targets with timeframes
    - List potential alternatives with cost-benefit analysis
    - Detail the environmental impact in concrete terms

    4. Precautionary Measures:
    - Suggest specific monitoring tools or methods
    - Recommend frequency of usage checks and audits
    - Provide emergency reduction strategies
    - List preventive maintenance tips
    - Detail long-term sustainability planning steps

    5. Comparison with Benchmarks:
    - Compare with national averages using exact figures
    - Highlight areas exceeding standard deviations from mean
    - Provide industry-specific comparisons where relevant
    - Calculate percentage difference from sustainable targets
    - Include regional context and climate considerations
    
    Data for Analysis:
    - Petrol Consumption (litres per month): ${carbonData[0].Petrol}
    - Diesel Consumption (litres per month): ${carbonData[0].Diesel}
    - Electricity Consumption (kWh per month): ${carbonData[0].Electricity}
    - Natural Gas Consumption (kg per month): ${carbonData[0].NaturalGas}
    - CNG Consumption (kg per month): ${carbonData[0].CNG}
    - Distance Travelled by Flight (km per month): ${carbonData[0].Flight}
    - LPG Usage (kg per month): ${carbonData[0].LPG}
    - Fuel Oil Consumption (litres per month): ${carbonData[0].FuelOil}
    - Coal Usage (kg per month): ${carbonData[0].Coal}
    - Organic Waste (kg per month): ${carbonData[0].OrganicWaste}
    - Paper Waste (kg per month): ${carbonData[0].PaperWaste}
    - Plastic Waste (kg per month): ${carbonData[0].PlasticWaste}
    - Water Usage (litres per month): ${carbonData[0].WaterUsage}
    - Public Transport Usage (passenger-km per month): ${carbonData[0].PublicTransportUsage}

    IMPORTANT: Follow these rules strictly:
    1. Start each point with a hyphen (-)
    2. Do not include any introductory text or thank you messages
    3. Keep each point concise and specific
    4. Maintain the exact section numbering and format
    5. Only include the sections mentioned above
    `;

    let responseData = "";

    const pythonProcess = spawn("python3", ["app.py", messageContent]);

    pythonProcess.stdout.on("data", (data) => {
      responseData += data.toString();
    });

    let errorOutput = "";
    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    await new Promise((resolve, reject) => {
      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed with code ${code}`));
          return;
        }
        resolve();
      });
    });

    try {
      const cleanedResponse = responseData.trim();
      const parsedResponse = JSON.parse(cleanedResponse);
      return res.json(parsedResponse);
    } catch (parseError) {
      return res.status(500).json({
        error: "Failed to parse AI response",
        details: parseError.message,
        rawResponse: responseData,
      });
    }
  } catch (err) {
    console.error("Error in chatWithMistralAI:", err);
    return res.status(500).json({
      error: "An error occurred while processing the request",
      details: err.message,
    });
  }
};

