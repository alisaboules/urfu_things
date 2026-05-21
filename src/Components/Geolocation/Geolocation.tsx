import { useState } from "react";
import { getNearestPickupPoint } from "../../Api/Api";

interface PickupPointResponse {
  nearest: {
    name: string;
  };
  distance_km: number;
}

function PickupFinder() {
  const [pickupPoint, setPickupPoint] =
    useState<PickupPointResponse | null>(null);

  const [loading, setLoading] = useState(false);

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
      <button onClick={handleFindPickup}>
        {loading ? "Загрузка..." : "Найти пункт"}
      </button>

      {error && <p>{error}</p>}

      {pickupPoint && (
        <div>
          <h3>{pickupPoint.nearest.name}</h3>

          <p>
            Расстояние: {pickupPoint.distance_km} км
          </p>
        </div>
      )}
    </div>
  );
}

export { PickupFinder };