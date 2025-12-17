import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const TermsAndConditionsModal: React.FC<
  TermsAndConditionsModalProps
> = ({ isOpen, onAccept }) => {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    if (isAccepted) {
      onAccept();
    }
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setIsAccepted(checked === true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-2xl max-h-[80vh]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Terms and Conditions
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full border rounded-md p-4">
          <div className="space-y-4 text-sm">
            <h3 className="font-semibold text-lg">Welcome to Art Gharana</h3>

            <p>
              By accessing and using Art Gharana's services, you agree to be
              bound by these Terms and Conditions. Please read them carefully
              before proceeding.
            </p>

            <h4 className="font-semibold">
              1. Class Attendance and Cancellation Policy
            </h4>
            <p>
              - Students must arrive on time for scheduled classes -
              Cancellations must be made at least 24 hours in advance - Late
              cancellations may result in credit deduction
            </p>

            <h4 className="font-semibold">2. Payment and Credit Policy</h4>
            <p>
              - All payments are processed securely through our payment gateways
              - Credits are non-refundable but can be transferred within the
              validity period - Auto-payment can be enabled/disabled at any time
              from your account
            </p>

            <h4 className="font-semibold">3. Code of Conduct</h4>
            <p>
              - Maintain respectful behavior towards instructors and fellow
              students - Follow dress code requirements for specific art forms -
              Mobile phones should be on silent during classes
            </p>

            <h4 className="font-semibold">4. Recording and Privacy</h4>
            <p>
              - Classes may be recorded for educational purposes - Student
              personal information is protected under our privacy policy -
              Sharing of class recordings outside the platform is prohibited
            </p>

            <h4 className="font-semibold">5. Liability</h4>
            <p>
              - Art Gharana is not liable for injuries during classes - Students
              participate at their own risk - Proper warm-up and safety
              guidelines must be followed
            </p>

            <p className="text-xs text-gray-600 mt-6">
              Last updated: January 2025
            </p>
          </div>
        </ScrollArea>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isAccepted}
              onCheckedChange={handleCheckboxChange}
              required
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and agree to the{" "}
              <a
                href="/policies"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 underline hover:text-orange-700"
              >
                Terms and Conditions
              </a>
              *
            </label>
          </div>

          <Button
            onClick={handleAccept}
            disabled={!isAccepted}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Accept and Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
