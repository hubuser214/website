import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft } from "lucide-react";

// Conversion data
const conversionData = {
  length: {
    name: "Length",
    units: {
      meter: { name: "Meter", symbol: "m", factor: 1 },
      kilometer: { name: "Kilometer", symbol: "km", factor: 1000 },
      centimeter: { name: "Centimeter", symbol: "cm", factor: 0.01 },
      millimeter: { name: "Millimeter", symbol: "mm", factor: 0.001 },
      micrometer: { name: "Micrometer", symbol: "μm", factor: 0.000001 },
      nanometer: { name: "Nanometer", symbol: "nm", factor: 0.000000001 },
      mile: { name: "Mile", symbol: "mi", factor: 1609.34 },
      yard: { name: "Yard", symbol: "yd", factor: 0.9144 },
      foot: { name: "Foot", symbol: "ft", factor: 0.3048 },
      inch: { name: "Inch", symbol: "in", factor: 0.0254 },
    }
  },
  temperature: {
    name: "Temperature",
    units: {
      celsius: { name: "Celsius", symbol: "°C" },
      fahrenheit: { name: "Fahrenheit", symbol: "°F" },
      kelvin: { name: "Kelvin", symbol: "K" },
    }
  },
  weight: {
    name: "Weight",
    units: {
      kilogram: { name: "Kilogram", symbol: "kg", factor: 1 },
      gram: { name: "Gram", symbol: "g", factor: 0.001 },
      pound: { name: "Pound", symbol: "lbs", factor: 0.453592 },
      ounce: { name: "Ounce", symbol: "oz", factor: 0.0283495 },
      ton: { name: "Ton", symbol: "t", factor: 1000 },
      stone: { name: "Stone", symbol: "st", factor: 6.35029 },
    }
  },
  volume: {
    name: "Volume",
    units: {
      liter: { name: "Liter", symbol: "L", factor: 1 },
      milliliter: { name: "Milliliter", symbol: "mL", factor: 0.001 },
      gallon: { name: "Gallon", symbol: "gal", factor: 3.78541 },
      quart: { name: "Quart", symbol: "qt", factor: 0.946353 },
      pint: { name: "Pint", symbol: "pt", factor: 0.473176 },
      cup: { name: "Cup", symbol: "cup", factor: 0.236588 },
      fluid_ounce: { name: "Fluid Ounce", symbol: "fl oz", factor: 0.0295735 },
    }
  },
  area: {
    name: "Area",
    units: {
      square_meter: { name: "Square Meter", symbol: "m²", factor: 1 },
      square_kilometer: { name: "Square Kilometer", symbol: "km²", factor: 1000000 },
      square_centimeter: { name: "Square Centimeter", symbol: "cm²", factor: 0.0001 },
      square_foot: { name: "Square Foot", symbol: "ft²", factor: 0.092903 },
      square_inch: { name: "Square Inch", symbol: "in²", factor: 0.00064516 },
      acre: { name: "Acre", symbol: "ac", factor: 4046.86 },
      hectare: { name: "Hectare", symbol: "ha", factor: 10000 },
    }
  },
  time: {
    name: "Time",
    units: {
      second: { name: "Second", symbol: "s", factor: 1 },
      minute: { name: "Minute", symbol: "min", factor: 60 },
      hour: { name: "Hour", symbol: "h", factor: 3600 },
      day: { name: "Day", symbol: "d", factor: 86400 },
      week: { name: "Week", symbol: "wk", factor: 604800 },
      month: { name: "Month", symbol: "mo", factor: 2629746 },
      year: { name: "Year", symbol: "yr", factor: 31556952 },
    }
  }
};

const commonConversions = [
  { from: "centimeter", to: "inch", category: "length", label: "cm to inches" },
  { from: "kilogram", to: "pound", category: "weight", label: "kg to lbs" },
  { from: "celsius", to: "fahrenheit", category: "temperature", label: "Celsius to Fahrenheit" },
  { from: "millimeter", to: "inch", category: "length", label: "mm to inches" },
  { from: "meter", to: "foot", category: "length", label: "meters to feet" },
  { from: "kilometer", to: "mile", category: "length", label: "km to miles" },
  { from: "liter", to: "gallon", category: "volume", label: "liters to gallons" },
  { from: "gram", to: "ounce", category: "weight", label: "grams to ounces" },
];

export function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("foot");
  const [fromValue, setFromValue] = useState("1");
  const [toValue, setToValue] = useState("");

  // Convert between units
  const convertValue = (value: string, from: string, to: string, category: string) => {
    if (!value || !from || !to) return "";
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "";

    if (category === "temperature") {
      return convertTemperature(numValue, from, to).toString();
    }

    const categoryData = conversionData[category as keyof typeof conversionData];
    if (!categoryData || !("factor" in categoryData.units[from]) || !("factor" in categoryData.units[to])) return "";

    const fromFactor = (categoryData.units[from] as any).factor;
    const toFactor = (categoryData.units[to] as any).factor;
    
    const result = (numValue * fromFactor) / toFactor;
    return result.toFixed(8).replace(/\.?0+$/, "");
  };

  const convertTemperature = (value: number, from: string, to: string) => {
    let celsius = value;
    
    // Convert to Celsius first
    if (from === "fahrenheit") {
      celsius = (value - 32) * 5/9;
    } else if (from === "kelvin") {
      celsius = value - 273.15;
    }
    
    // Convert from Celsius to target
    if (to === "fahrenheit") {
      return celsius * 9/5 + 32;
    } else if (to === "kelvin") {
      return celsius + 273.15;
    }
    
    return celsius;
  };

  // Update conversion when values change
  useEffect(() => {
    if (fromValue && fromUnit && toUnit) {
      const result = convertValue(fromValue, fromUnit, toUnit, activeCategory);
      setToValue(result);
    }
  }, [fromValue, fromUnit, toUnit, activeCategory]);

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const handleCommonConversion = (conversion: typeof commonConversions[0]) => {
    setActiveCategory(conversion.category);
    setFromUnit(conversion.from);
    setToUnit(conversion.to);
    setFromValue("1");
  };

  const currentUnits = conversionData[activeCategory as keyof typeof conversionData]?.units || {};

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* SEO Header with semantic HTML */}
      <header className="container max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Free Unit Converter Tool
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl mx-auto">
            Convert between length, weight, temperature, volume, area, and time units instantly. 
            Accurate conversions for metric and imperial measurements.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-white/70">
            <span>✓ Meters to Feet</span>
            <span>✓ Kg to Lbs</span>
            <span>✓ Celsius to Fahrenheit</span>
            <span>✓ Liters to Gallons</span>
            <span>✓ And More</span>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4">

        {/* Main Converter Tool */}
        <section className="mb-12">
          <Card className="bg-gradient-card shadow-card border-0 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-2xl md:text-3xl text-center text-primary">
                Universal Unit Converter
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Select a category and convert between any units instantly
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8 h-auto p-1">
                  {Object.entries(conversionData).map(([key, data]) => (
                    <TabsTrigger 
                      key={key} 
                      value={key} 
                      className="text-xs md:text-sm py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      {data.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.keys(conversionData).map(category => (
                  <TabsContent key={category} value={category} className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                      {/* From Section */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-foreground">From:</label>
                        <Select value={fromUnit} onValueChange={setFromUnit}>
                          <SelectTrigger className="bg-background border-2 hover:border-primary/50 transition-colors h-12">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover max-h-60">
                            {Object.entries(currentUnits).map(([key, unit]) => (
                              <SelectItem key={key} value={key} className="hover:bg-accent">
                                {(unit as any).name} ({(unit as any).symbol})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Enter value"
                          value={fromValue}
                          onChange={(e) => setFromValue(e.target.value)}
                          className="bg-background border-2 hover:border-primary/50 focus:border-primary h-12 text-lg"
                          step="any"
                        />
                      </div>

                      {/* Swap Button */}
                      <div className="flex justify-center lg:block">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleSwapUnits}
                          className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 h-12 w-12 border-2 hover:border-primary hover:scale-110"
                          title="Swap units"
                        >
                          <ArrowRightLeft className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* To Section */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-foreground">To:</label>
                        <Select value={toUnit} onValueChange={setToUnit}>
                          <SelectTrigger className="bg-background border-2 hover:border-primary/50 transition-colors h-12">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover max-h-60">
                            {Object.entries(currentUnits).map(([key, unit]) => (
                              <SelectItem key={key} value={key} className="hover:bg-accent">
                                {(unit as any).name} ({(unit as any).symbol})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="Result"
                            value={toValue}
                            readOnly
                            className="bg-primary/5 border-2 border-primary/20 h-12 text-lg font-semibold text-primary"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Quick Conversions Section */}
        <section className="mb-12">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-xl md:text-2xl text-primary">Quick Conversions</CardTitle>
              <p className="text-muted-foreground">Popular unit conversions with one click</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {commonConversions.map((conversion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCommonConversion(conversion)}
                    className="text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-2 hover:border-primary hover:scale-105 py-3"
                  >
                    {conversion.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SEO Content Section */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Why Use Our Unit Converter?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>Instant Results:</strong> Real-time conversion as you type</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>High Precision:</strong> Accurate to 8 decimal places</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>Mobile Friendly:</strong> Works perfectly on all devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>No Registration:</strong> Free to use, no sign-up required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span><strong>Comprehensive:</strong> 6 categories with 40+ units</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Supported Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Length:</h4>
                    <p className="text-muted-foreground">Meters, feet, inches, kilometers, miles, centimeters, millimeters, yards</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Weight:</h4>
                    <p className="text-muted-foreground">Kilograms, pounds, ounces, grams, tons, stones</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Temperature:</h4>
                    <p className="text-muted-foreground">Celsius, Fahrenheit, Kelvin</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Volume:</h4>
                    <p className="text-muted-foreground">Liters, gallons, milliliters, cups, pints, quarts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary/5 border-t border-primary/10 mt-12">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Free Unit Converter Tool</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Convert between metric and imperial units instantly. Perfect for students, professionals, and everyday use.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 UnitConverter.dev - Free online unit conversion tool
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
