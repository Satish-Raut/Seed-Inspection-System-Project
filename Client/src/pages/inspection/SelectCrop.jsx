import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import { useInspection } from "../../hooks/useInspection";
import { CROP_TYPES } from "../../utils/constants";

export default function SelectCrop() {
  const { current, setCropType } = useInspection();
  const navigate = useNavigate();

  const handleSelect = (crop) => {
    setCropType(crop.id);
    navigate(`/inspection/${current.id}/production`);
  };

  return (
    <AppLayout title="Select Crop Type" showBack>
      <div className="max-w-5xl mx-auto">
        <p className="text-text-secondary text-sm mb-8">
          Choose the crop you'll be inspecting today.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CROP_TYPES.map((crop) => {
            const isSelected = current.cropType === crop.id;
            return (
              <button
                key={crop.id}
                id={`crop-${crop.id}`}
                onClick={() => handleSelect(crop)}
                className={`flex flex-col items-center gap-4 p-8 rounded-3xl border-2
                            transition-all duration-300 active:scale-95 text-center group cursor-pointer
                            ${
                              isSelected
                                ? "border-primary bg-primary-lighter shadow-xl shadow-primary/10"
                                : "border-border bg-white hover:border-primary-mid hover:shadow-lg"
                            }`}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-sm transform group-hover:scale-110 transition-transform"
                  style={{ background: crop.bg }}
                >
                  {crop.emoji}
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className={`font-black text-base ${isSelected ? "text-primary" : "text-text-primary"}`}
                  >
                    {crop.label}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] uppercase tracking-widest font-black bg-primary text-white px-3 py-1 rounded-full">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
