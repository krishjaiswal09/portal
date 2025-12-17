
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Users } from "lucide-react";

export function BookFreeTrialSection() {
  const handleBookTrial = () => {
    console.log('Book free trial clicked - will implement page later');
    // Placeholder for future navigation to Book Free Trial Class page
  };

  const steps = [{
    number: 1,
    title: "Sign Up",
    description: "Register for your free trial"
  }, {
    number: 2,
    title: "Choose Schedule",
    description: "Pick your preferred time"
  }, {
    number: 3,
    title: "Join Session",
    description: "Connect with your instructor"
  }, {
    number: 4,
    title: "Experience Magic",
    description: "Enjoy personalized learning"
  }, {
    number: 5,
    title: "Decide with Confidence",
    description: "Choose your learning path"
  }];

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-playfair font-bold text-gray-900">Book Your Free Trial</h2>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Experience personalized learning with our expert instructors - completely free!
          </p>
          <Button 
            onClick={handleBookTrial}
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Free Trial Class
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold text-lg">{step.number}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-orange-200 transform translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
