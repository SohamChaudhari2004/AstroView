export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateCountdown = (launchDate: string): string => {
  const now = new Date();
  const launch = new Date(launchDate);
  const diff = launch.getTime() - now.getTime();

  if (diff <= 0) return 'LAUNCHED';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

export const formatDistance = (km: number): string => {
  if (km > 1000000) {
    return `${(km / 1000000).toFixed(2)}M km`;
  }
  if (km > 1000) {
    return `${(km / 1000).toFixed(2)}K km`;
  }
  return `${km.toFixed(2)} km`;
};

export const formatVelocity = (kmPerSec: number): string => {
  return `${(kmPerSec * 3.6).toFixed(2)} km/h`;
};

export const getThreatLevel = (hazardousList: boolean[], count: number): 'low' | 'moderate' | 'high' => {
  const hazardousCount = hazardousList.filter((h) => h).length;
  const percentage = (hazardousCount / count) * 100;

  if (percentage > 30) return 'high';
  if (percentage > 10) return 'moderate';
  return 'low';
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'scheduled':
    case 'stable':
    case 'low':
      return 'text-cyan-400';
    case 'upcoming':
    case 'warning':
    case 'moderate':
      return 'text-yellow-400';
    case 'alert':
    case 'high':
      return 'text-accent-danger';
    default:
      return 'text-text-secondary';
  }
};

export const clsx = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
