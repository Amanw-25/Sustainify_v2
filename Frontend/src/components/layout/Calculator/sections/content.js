import React from "react";
import {
  LocalGasStation,
  ElectricBolt,
  GasMeter,
  Flight,
  LocalFireDepartment,
  Delete,
  WaterDrop,
  DirectionsBus,
  Train,
  DirectionsSubway,
} from "@mui/icons-material";

export const primaryFields = [
  {
    key: "petrol",
    label: "Petrol",
    unit: "L/month",
    icon: React.createElement(LocalGasStation),
  },
  {
    key: "diesel",
    label: "Diesel",
    unit: "L/month",
    icon: React.createElement(LocalGasStation),
  },
  {
    key: "electricity",
    label: "Electricity",
    unit: "kWh/month",
    icon: React.createElement(ElectricBolt),
  },
  {
    key: "naturalGas",
    label: "Natural Gas",
    unit: "m³/month",
    icon: React.createElement(GasMeter),
  },
  {
    key: "cng",
    label: "CNG",
    unit: "kg/month",
    icon: React.createElement(GasMeter),
  },
  {
    key: "flight",
    label: "Flight",
    unit: "km/month",
    icon: React.createElement(Flight),
  },
  {
    key: "lpg",
    label: "LPG",
    unit: "kg/month",
    icon: React.createElement(LocalFireDepartment),
  },
  {
    key: "fuelOil",
    label: "Fuel Oil",
    unit: "L/month",
    icon: React.createElement(LocalGasStation),
  },
  {
    key: "coal",
    label: "Coal",
    unit: "kg/month",
    icon: React.createElement(LocalFireDepartment),
  },
];

export const secondaryFields = [
  {
    key: "organicWaste",
    label: "Organic Waste",
    unit: "kg/month",
    icon: React.createElement(Delete),
  },
  {
    key: "paperWaste",
    label: "Paper Waste",
    unit: "kg/month",
    icon: React.createElement(Delete),
  },
  {
    key: "plasticWaste",
    label: "Plastic Waste",
    unit: "kg/month",
    icon: React.createElement(Delete),
  },
  {
    key: "waterUsage",
    label: "Water Usage",
    unit: "m³/month",
    icon: React.createElement(WaterDrop),
  },
  {
    key: "busUsage",
    label: "Bus Usage",
    unit: "km/month",
    icon: React.createElement(DirectionsBus),
  },
  {
    key: "trainUsage",
    label: "Train Usage",
    unit: "km/month",
    icon: React.createElement(Train),
  },
  {
    key: "metroUsage",
    label: "Metro Usage",
    unit: "km/month",
    icon: React.createElement(DirectionsSubway),
  },
];
