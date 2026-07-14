"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePropertyForm } from "@/lib/hooks/use-property-form";
import { createProperty, saveDraft, updateDraft } from "@/lib/actions/property";
import { stepValidators } from "@/lib/validations/property";
import { cn } from "@/lib/utils/cn";
import { ArrowLeft, ArrowRight, Save, Loader2, Rocket, Sparkles, X } from "lucide-react";
import Link from "next/link";
import StepPropertyType from "@/Components/property/steps/step-property-type";
import StepLocation from "@/Components/property/steps/step-location";
import StepDetails from "@/Components/property/steps/step-details";
import StepAmenities from "@/Components/property/steps/step-amenities";
import StepPhotos from "@/Components/property/steps/step-photos";
import StepPricing from "@/Components/property/steps/step-pricing";
import StepAvailability from "@/Components/property/steps/step-availability";
import StepHouseRules from "@/Components/property/steps/step-house-rules";
import StepPreview from "@/Components/property/steps/step-preview";
import PropertyStepper from "@/Components/property/property-stepper";

interface PropertyFormWizardProps {
    propertyId?: string;
}

export default function PropertyFormWizard({ propertyId }: PropertyFormWizardProps) {
    const router = useRouter();
    const isEditMode = !!propertyId;

    const {
        formData,
        currentStep,
        updateFormData,
        updateNestedField,
        nextStep,
        prevStep,
        goToStep,
        resetForm,
        draftId,
        setDraftId,
    } = usePropertyForm();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPublishing, setIsPublishing] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const completedSteps = useMemo(() => {
        const completed = new Set<number>();
        for (let i = 0; i < currentStep; i++) {
            completed.add(i);
        }
        return completed;
    }, [currentStep]);

    const validateCurrentStep = useCallback(() => {
        const validator = stepValidators[currentStep];
        if (!validator) return true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = validator(formData as any);
        setErrors(result.errors);
        return result.isValid;
    }, [currentStep, formData]);

    const handleNext = useCallback(() => {
        if (validateCurrentStep()) {
            setErrors({});
            nextStep();
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            toast.error("Please fix the errors before continuing.");
        }
    }, [validateCurrentStep, nextStep]);

    const handlePrev = useCallback(() => {
        setErrors({});
        prevStep();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [prevStep]);

    const handleSaveDraft = useCallback(async () => {
        setIsSavingDraft(true);
        const toastId = toast.loading(isEditMode ? "Saving changes..." : "Saving draft...");

        try {
            if (isEditMode && propertyId) {
                const result = await updateDraft(propertyId, formData);
                if (!result.success) {
                    toast.error(result.error || "Failed to save changes", { id: toastId });
                    return;
                }
                toast.success("Changes saved successfully!", { id: toastId });
                router.push("/dashboard/host/items/manage");
                return;
            }

            const result = await saveDraft({ ...formData, status: "draft" });

            if (!result.success) {
                toast.error(result.error || "Failed to save draft", {
                    id: toastId,
                    description: "Please check the form and try again.",
                });
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const savedData = result.data as any;
            const savedId = savedData?.id || savedData?._id;
            if (savedId && !draftId) {
                setDraftId(savedId);
            }

            toast.success("Draft saved successfully!", {
                id: toastId,
                description: "You can continue editing anytime.",
            });
        } catch (error) {
            console.error("Failed to save:", error);
            toast.error("Something went wrong", {
                id: toastId,
                description: error instanceof Error ? error.message : "Unknown error",
            });
        } finally {
            setIsSavingDraft(false);
        }
    }, [isEditMode, propertyId, formData, draftId, setDraftId, router]);

    const handlePublish = useCallback(async () => {
        setIsPublishing(true);
        const toastId = toast.loading(isEditMode ? "Saving changes..." : "Publishing your listing...");

        try {
            if (isEditMode && propertyId) {
                const result = await updateDraft(propertyId, formData);
                if (!result.success) {
                    toast.error(result.error || "Failed to save changes", { id: toastId });
                    setIsPublishing(false);
                    return;
                }
                toast.success("Changes saved!", { id: toastId });
                setShowSuccess(true);
                resetForm();
                setTimeout(() => {
                    router.push("/dashboard/host/items/manage");
                }, 1500);
                return;
            }

            const result = await createProperty({ ...formData, status: "published" });

            if (!result.success) {
                toast.error("Failed to publish", {
                    id: toastId,
                    description: result.error || "Please review your listing and try again.",
                });
                setIsPublishing(false);
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const publishedData = result.data as any;
            const newId = publishedData?.id || publishedData?._id;

            toast.success("Listing published!", {
                id: toastId,
                description: "Your property is now under review.",
            });

            setShowSuccess(true);
            resetForm();
            setTimeout(() => {
                if (newId) {
                    router.push(`/items/${newId}`);
                } else {
                    router.push("/dashboard");
                }
            }, 2500);
        } catch (error) {
            console.error("Failed to publish:", error);
            toast.error("Something went wrong", {
                id: toastId,
                description: error instanceof Error ? error.message : "Unknown error",
            });
            setIsPublishing(false);
        }
    }, [isEditMode, propertyId, formData, resetForm, router]);

    const isLastStep = currentStep === 8;
    const isFirstStep = currentStep === 0;

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <StepPropertyType formData={formData} updateFormData={updateFormData} errors={errors} />;
            case 1:
                return <StepLocation formData={formData} updateNestedField={updateNestedField} errors={errors} />;
            case 2:
                return <StepDetails formData={formData} updateFormData={updateFormData} errors={errors} />;
            case 3:
                return <StepAmenities formData={formData} updateFormData={updateFormData} errors={errors} />;
            case 4:
                return <StepPhotos formData={formData} updateFormData={updateFormData} errors={errors} />;
            case 5:
                return <StepPricing formData={formData} updateNestedField={updateNestedField} errors={errors} />;
            case 6:
                return <StepAvailability formData={formData} updateNestedField={updateNestedField} errors={errors} />;
            case 7:
                return <StepHouseRules formData={formData} updateNestedField={updateNestedField} errors={errors} />;
            case 8:
                return <StepPreview formData={formData} goToStep={goToStep} />;
            default:
                return null;
        }
    };

    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                    >
                        <Rocket className="w-12 h-12 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-bold text-gray-900 dark:text-white mb-3"
                    >
                        {isEditMode ? "Saved! \u2705" : "Published! \ud83c\udf89"}
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-500 dark:text-gray-400 text-lg"
                    >
                        {isEditMode ? "Changes saved successfully. Redirecting..." : "Your listing is now live. Redirecting..."}
                    </motion.p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.6, duration: 2 }}
                        className="w-48 h-1 bg-green-500 rounded-full mx-auto mt-6 origin-left"
                    />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800"
            >
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link
                        href={isEditMode ? "/dashboard/host/items/manage" : "/dashboard"}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                        <span className="hidden sm:inline text-sm font-medium">
                            {isEditMode ? "Back to Manage" : "Exit"}
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-rose-500" />
                        <span className="font-bold text-gray-900 dark:text-white">
                            {isEditMode ? "Edit Listing" : "Create Listing"}
                        </span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSavingDraft}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {isSavingDraft ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">{isEditMode ? "Save" : "Save Draft"}</span>
                    </motion.button>
                </div>
            </motion.header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10"
                >
                    <PropertyStepper
                        currentStep={currentStep}
                        goToStep={(step) => {
                            setErrors({});
                            goToStep(step);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        completedSteps={completedSteps}
                    />
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mb-28"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </main>

            <motion.footer
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800"
            >
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handlePrev}
                        disabled={isFirstStep}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all",
                            isFirstStep
                                ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 underline underline-offset-4"
                        )}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </motion.button>

                    {isLastStep ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50"
                        >
                            {isPublishing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {isEditMode ? "Saving..." : "Publishing..."}
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-4 h-4" />
                                    {isEditMode ? "Save Changes" : "Publish Listing"}
                                </>
                            )}
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 px-8 py-3.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg shadow-gray-900/10 transition-all"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    )}
                </div>
            </motion.footer>
        </div>
    );
}
