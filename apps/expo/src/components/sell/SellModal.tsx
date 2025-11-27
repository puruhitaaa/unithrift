import { useState } from "react";
import { Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SellForm } from "./SellForm";
import { SellMediaSelector } from "./SellMediaSelector";

interface MediaAsset {
  uri: string;
  type: "image" | "video";
  fileName?: string;
}

type SellStep = "media" | "form";

interface SellModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SellModal({ visible, onClose }: SellModalProps) {
  const [currentStep, setCurrentStep] = useState<SellStep>("media");
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset[]>([]);

  // Reset state when modal closes
  const handleClose = () => {
    setCurrentStep("media");
    setSelectedMedia([]);
    onClose();
  };

  const handleMediaContinue = () => {
    setCurrentStep("form");
  };

  const handleBackToMedia = () => {
    setCurrentStep("media");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {currentStep === "media" && (
          <SellMediaSelector
            selectedMedia={selectedMedia}
            onMediaSelected={setSelectedMedia}
            onContinue={handleMediaContinue}
          />
        )}

        {currentStep === "form" && (
          <SellForm
            selectedMedia={selectedMedia}
            onBack={handleBackToMedia}
            onClose={handleClose}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}
