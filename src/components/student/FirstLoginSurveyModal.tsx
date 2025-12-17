import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Instagram,
  Facebook,
  Youtube,
  Search,
  Users,
  MoreHorizontal,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

// Custom Pinterest Icon Component
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.374 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.999-5.375 11.999-12C24 5.374 18.626.001 12.001.001z" />
  </svg>
);

interface FirstLoginSurveyModalProps {
  isOpen: boolean;
  onComplete: (payload: { user_id: number; source_name: string }) => void;
}

export function FirstLoginSurveyModal({
  isOpen,
  onComplete,
}: FirstLoginSurveyModalProps) {
  const { user } = useAuth();
  const [selectedSource, setSelectedSource] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [referrerEmail, setReferrerEmail] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);

  const sources = [
    {
      id: "Instagram",
      label: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    { id: "Facebook", label: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { id: "Google", label: "Google", icon: Search, color: "bg-emerald-600" },
    { id: "LinkedIn", label: "LinkedIn", icon: Linkedin, color: "bg-blue-700" },
    { id: "YouTube", label: "YouTube", icon: Youtube, color: "bg-red-600" },
    { id: "X", label: "X", icon: Twitter, color: "bg-black" },
    {
      id: "Pinterest",
      label: "Pinterest",
      icon: PinterestIcon,
      color: "bg-red-500",
    },
    {
      id: "Sulekha",
      label: "Sulekha",
      icon: null,
      color: "bg-orange-600",
      customLogo: "/art-gharana-logo.png",
    },
    {
      id: "Family / Friends",
      label: "Family / Friends",
      icon: Users,
      color: "bg-amber-600",
    },
    {
      id: "Others",
      label: "Others",
      icon: MoreHorizontal,
      color: "bg-gray-600",
    },
  ];

  const handleSubmit = () => {
    if (!selectedSource || !isAccepted) return;

    const payload = {
      user_id: user?.id,
      source_name: selectedSource === "Others" ? otherDetails : selectedSource,
    };

    onComplete(payload);
  };

  const isSubmitDisabled = () => {
    if (!selectedSource || !isAccepted) return true;
    if (selectedSource === "Others" && !otherDetails.trim()) return true;
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-2 pb-1">
          <DialogTitle className="text-2xl font-playfair font-bold text-gray-900">
            Welcome to Art Gharana!
          </DialogTitle>
          <p className="text-gray-600 text-base leading-relaxed">
            Help us serve you better. How did you hear about us?
          </p>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="grid grid-cols-3 gap-2">
            {sources.map((source) => {
              const IconComponent = source.icon;
              return (
                <div
                  key={source.id}
                  onClick={() => setSelectedSource(source.id)}
                  className={`
                    relative cursor-pointer rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg
                    ${
                      selectedSource === source.id
                        ? "border-orange-500 bg-orange-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }
                  `}
                >
                  <div className="p-3 text-center space-y-1">
                    <div
                      className={`w-8 h-8 mx-auto rounded-full ${source.color} flex items-center justify-center shadow-lg`}
                    >
                      {source.customLogo ? (
                        <img
                          src={source.customLogo}
                          alt={source.label}
                          className="w-5 h-5 object-contain rounded"
                        />
                      ) : IconComponent ? (
                        <IconComponent className="w-4 h-4 text-white" />
                      ) : (
                        <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
                      )}
                    </div>
                    <p className="font-medium text-gray-900 text-sm">
                      {source.label}
                    </p>
                  </div>

                  {selectedSource === source.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedSource === "Others" && (
            <div className="space-y-2 pt-2 animate-fade-in">
              <Label
                htmlFor="other-details"
                className="text-sm font-medium text-gray-700"
              >
                Please tell us more:
              </Label>
              <Input
                id="other-details"
                value={otherDetails}
                onChange={(e) => setOtherDetails(e.target.value)}
                placeholder="How did you discover Art Gharana?"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 py-2 text-sm"
              />
            </div>
          )}

          {selectedSource === "Family / Friends" && (
            <div className="space-y-2 pt-2 animate-fade-in">
              <Label
                htmlFor="referrer-email"
                className="text-sm font-medium text-gray-700"
              >
                Referrer's Email Address:
              </Label>
              <Input
                id="referrer-email"
                type="email"
                value={referrerEmail}
                onChange={(e) => setReferrerEmail(e.target.value)}
                placeholder="friend@example.com"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 py-2 text-sm"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isAccepted}
              onCheckedChange={(checked) => setIsAccepted(checked === true)}
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
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 text-base rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
