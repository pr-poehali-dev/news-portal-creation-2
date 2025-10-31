import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherData {
  city: string;
  temperature: number;
  feels_like: number;
  description: string;
  humidity: number;
  wind_speed: number;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState('Moscow');
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  const russianCities = [
    'Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg',
    'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don'
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      try {
        const response = await fetch(`https://functions.poehali.dev/de810bca-7f46-4d7a-a1a6-5456ee010c15?city=${selectedCity}`);
        if (response.ok) {
          const data = await response.json();
          setWeather(data);
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
      } finally {
        setIsLoadingWeather(false);
      }
    };
    fetchWeather();
  }, [selectedCity]);

  const getCityName = (city: string) => {
    const cityMap: Record<string, string> = {
      'Moscow': 'Москва',
      'Saint Petersburg': 'Санкт-Петербург',
      'Novosibirsk': 'Новосибирск',
      'Yekaterinburg': 'Екатеринбург',
      'Kazan': 'Казань',
      'Nizhny Novgorod': 'Нижний Новгород',
      'Chelyabinsk': 'Челябинск',
      'Samara': 'Самара',
      'Omsk': 'Омск',
      'Rostov-on-Don': 'Ростов-на-Дону'
    };
    return cityMap[city] || city;
  };

  return (
    <Card id="weather" className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="CloudSun" className="text-primary" />
          Погода
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="mb-3">
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            >
              {russianCities.map(city => (
                <option key={city} value={city}>{getCityName(city)}</option>
              ))}
            </select>
          </div>
          {isLoadingWeather ? (
            <div className="text-center py-8">
              <Icon name="Loader2" className="animate-spin mx-auto text-primary" size={32} />
            </div>
          ) : weather ? (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{weather.city}</h4>
                <p className="text-sm text-muted-foreground">{weather.description}</p>
                <p className="text-xs text-muted-foreground mt-1">Влажность: {weather.humidity}%</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{weather.temperature > 0 ? '+' : ''}{weather.temperature}°</p>
                <p className="text-xs text-muted-foreground">Ощущается: {weather.feels_like > 0 ? '+' : ''}{weather.feels_like}°</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-4">
              Не удалось загрузить погоду
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
