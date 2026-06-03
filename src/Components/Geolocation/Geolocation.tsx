import { useState } from "react";
import { getNearestPickupPoint } from "../../Api/Api";
import "./Geolocation.css";
import { toast } from "react-toastify";

interface PickupPointResponse {
  nearest: {
    id: number;
    name: string;
  };
  distance_km: number;
}

interface PickupFinderProps {
  onSelectPickup: (pickupId: number, pickupName: string) => void;
}

function PickupFinder({ onSelectPickup }: PickupFinderProps) {
  const [pickupPoint, setPickupPoint] = useState<PickupPointResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const handleFindPickup = async () => {
    try {
      setLoading(true);
      setError("");

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        },
      );

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const data = await getNearestPickupPoint(
        latitude,
        longitude,
      );

      setPickupPoint(data);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="pickup-finder-btn" onClick={handleFindPickup}>
        {loading ? "Загрузка..." : "Найти пункт"}
      </button>

      {error && toast.error(error, { className: "custom-toast-error" })}

      {pickupPoint && !confirmed && (
  <div className="pickup-confirm">
    <h3>
      Ближайший пункт:
      <span>{pickupPoint.nearest.name}</span>
    </h3>

    <p>{pickupPoint.distance_km} км</p>

    <p>Готовы отнести вещь в этот пункт?</p>

    <button
      onClick={() => {
        onSelectPickup(
          pickupPoint.nearest.id,
          pickupPoint.nearest.name
        );

        setConfirmed(true);

        toast.success("Пункт выбран");
      }}
    >
      Да
    </button>

    <button
      onClick={() => {
        setPickupPoint(null);
      }}
    >
      Нет
    </button>
  </div>
)}
    </div>
  );
}

export { PickupFinder };