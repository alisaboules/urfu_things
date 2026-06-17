import { useState } from 'react';
import { getNearestPickupPoint } from '../../Api/Api';
import './Geolocation.css';
import { toast } from 'react-toastify';

interface PickupPointResponse {
  id: number;
  name: string;
  address: string;
  distance_km: number
}

interface PickupPointResponses {
  nearest: PickupPointResponse;
  nearest_point_id: number;
  distance_km: number;
  all_points: PickupPointResponse[];
  user_location: { latitude: number; longitude: number };
}

interface PickupFinderProps {
  onSelectPickup: (pickupId: number, pickupName: string) => void;
}

function PickupFinder({ onSelectPickup }: PickupFinderProps) {
  const [searched, setSearched] = useState(false);
  const [availablePickups, setAvailablePickups] = useState<PickupPointResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
   const handleFindPickup = async () => {
    try {
      setLoading(true);
      setConfirmed(false); 

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const data: PickupPointResponses = await getNearestPickupPoint(latitude, longitude);

      if (data.all_points && data.all_points.length > 0) {
        setAvailablePickups(data.all_points);
        setCurrentIndex(0);
        setSearched(true);
      } else {
        toast.error('Не найдено ни одного пункта выдачи', { className: 'custom-toast-error' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Не удалось определить ваше местоположение или найти пункты', { className: 'custom-toast-error' });
    } finally {
      setLoading(false);
    }
  };
  const currentPickup = availablePickups[currentIndex];

  const handleAccept = () => {
    if (currentPickup) {
      onSelectPickup(currentPickup.id, currentPickup.name);
      setConfirmed(true);
      toast.success(`Пункт выбран`, { className: 'custom-toast' });
    }
  };

  const handleReject = () => {
    if (currentIndex + 1 < availablePickups.length) {
      setCurrentIndex(prev => prev + 1);
      toast.info(`Предлагаем следующий пункт`, { className: 'custom-toast-info' });
    } else {
      setAvailablePickups([]);
      setCurrentIndex(0);
      toast.info('Больше нет доступных пунктов выдачи', { className: 'custom-toast-info' });
    }
  };

  return (
    <div>
         {!searched && (
        <button className="pickup-finder-btn" onClick={handleFindPickup}>
          {loading ? 'Загрузка...' : 'Найти пункт'}
        </button>
      )}

      {currentPickup && !confirmed && (
        <div className="pickup-confirm">
          <h3>
            Ближайший пункт: <span>{currentPickup.name}</span>
          </h3>

          <p>{currentPickup.address}</p>

          <p className="ready">Готовы отнести вещь в этот пункт?</p>
          <div className="pickup-confirm-buttons">
            <button
              className="pickup-confirms"
              onClick={() => {
                handleAccept();
              }}>
              Да
            </button>

            <button
              className="pickup-confirms"
              onClick={() => {
                handleReject();
              }}>
              Нет
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { PickupFinder };
