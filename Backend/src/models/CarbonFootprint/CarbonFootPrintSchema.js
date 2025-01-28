import mongoose from "mongoose";

const carbonFootprintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Petrol: {
      type: Number,
      required: true,
    },
    Diesel: {
      type: Number,
      required: true,
    },
    Electricity: {
      type: Number,
      required: true,
    },
    NaturalGas: {
      type: Number,
      required: true,
    },
    CNG: {
      type: Number,
      required: true,
    },
    Flight: {
      type: Number,
      required: true,
    },
    LPG: {
      type: Number,
      required: true,
    },
    FuelOil: {
      type: Number,
      required: true,
    },
    Coal: {
      type: Number,
      required: true,
    },
    OrganicWaste: {
      type: Number,
      required: true,
    },
    PaperWaste: {
      type: Number,
      required: true,
    },
    PlasticWaste: {
      type: Number,
      required: true,
    },
    WaterUsage: {
      type: Number,
      required: true,
    },
    PublicTransportUsage: {
      Bus: { type: Number, required: true },
      Train: { type: Number, required: true },
      Metro: { type: Number, required: true },
    },
    Total: {
      type: Number,
    },
  },
  { timestamps: true }
);

const CarbonFootprint = mongoose.model("CarbonFootprint", carbonFootprintSchema);

const factors = {
  Petrol: 2.296,
  Diesel: 2.716,
  Electricity: 0.7132,
  NaturalGas: 0.203,
  CNG: 2.720,
  Flight: 2.5,
  LPG: 3.014,
  FuelOil: 2.987,
  Coal: 2.478,
  OrganicWaste: 0.25,
  PaperWaste: 1.46,
  PlasticWaste: 6.0,
  WaterUsage: 0.0003,
  PublicTransportUsage: {
    Bus: 0.102,
    Train: 0.041,
    Metro: 0.048,
  },
};

CarbonFootprint.calculate = async (data) => {
  const CarbonData = {
    Petrol: data.Petrol * factors.Petrol,
    Diesel: data.Diesel * factors.Diesel,
    Electricity: data.Electricity * factors.Electricity,
    NaturalGas: data.NaturalGas * factors.NaturalGas,
    CNG: data.CNG * factors.CNG,
    Flight: data.Flight * factors.Flight,
    LPG: data.LPG * factors.LPG,
    FuelOil: data.FuelOil * factors.FuelOil,
    Coal: data.Coal * factors.Coal,
    OrganicWaste: data.OrganicWaste * factors.OrganicWaste,
    PaperWaste: data.PaperWaste * factors.PaperWaste,
    PlasticWaste: data.PlasticWaste * factors.PlasticWaste,
    WaterUsage: data.WaterUsage * factors.WaterUsage,
    PublicTransportUsage: {
      Bus: data.PublicTransportUsage.Bus * factors.PublicTransportUsage.Bus,
      Train: data.PublicTransportUsage.Train * factors.PublicTransportUsage.Train,
      Metro: data.PublicTransportUsage.Metro * factors.PublicTransportUsage.Metro,
    },
  };

  CarbonData.PublicTransportUsageTotal = Object.values(CarbonData.PublicTransportUsage).reduce((acc, curr) => acc + curr, 0);

  CarbonData.Total = Object.values(CarbonData)
    .filter((value) => typeof value === "number") 
    .reduce((acc, curr) => acc + curr, 0);

  return CarbonData;
};

export default CarbonFootprint;