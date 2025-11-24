import { useState } from "react";
import { Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "~/utils/auth";
import { SellForm } from "./SellForm";
import { SellMediaSelector } from "./SellMediaSelector";
import { SellModalLogin } from "./SellModalLogin";

interface MediaAsset {
  uri: string;
  type: "image" | "video";
  fileName?: string;
}

type SellStep = "login" | "media" | "form";

interface SellModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SellModal({ visible, onClose }: SellModalProps) {
  const { data: session } = authClient.useSession();
  const [currentStep, setCurrentStep] = useState<SellStep>("media");
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset[]>([]);

  // Reset state when modal closes
  const handleClose = () => {
    setCurrentStep("media");
    setSelectedMedia([]);
    onClose();
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
      // After successful login, move to media selection
      setCurrentStep("media");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleMediaContinue = () => {
    setCurrentStep("form");
  };

  const handleBackToMedia = () => {
    setCurrentStep("media");
  };

  const handleSubmit = () => {
    // TODO: Implement form submission when backend is ready
    console.log("Form submitted with media:", selectedMedia);
    // For now, just close the modal
    handleClose();
  };

  // Determine which step to show
  const getStepToShow = (): SellStep => {
    if (!session) return "login";
    return currentStep;
  };

  const stepToShow = getStepToShow();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {stepToShow === "login" && (
          <SellModalLogin onGoogleLogin={handleGoogleLogin} />
        )}

        {stepToShow === "media" && (
          <SellMediaSelector
            selectedMedia={selectedMedia}
            onMediaSelected={setSelectedMedia}
            onContinue={handleMediaContinue}
          />
        )}

        {stepToShow === "form" && (
          <SellForm
            selectedMedia={selectedMedia}
            onBack={handleBackToMedia}
            onSubmit={handleSubmit}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}
