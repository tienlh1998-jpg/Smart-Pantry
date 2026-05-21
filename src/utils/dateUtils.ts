export function calculateDaysLeft(expiryDateStr: string): number {
  if (!expiryDateStr) return 999;
  
  // Create Date objects at midnight to calculate full calendar days
  const expiryDate = new Date(expiryDateStr);
  expiryDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export interface ExpiryStatus {
  daysLeft: number;
  colorClass: string;
  badgeClass: string;
  text: string;
}

export function getExpiryStatus(expiryDateStr: string, isEnglish: boolean): ExpiryStatus {
  const daysLeft = calculateDaysLeft(expiryDateStr);
  
  if (daysLeft < 0) {
    return {
      daysLeft,
      colorClass: "text-rose-600 font-semibold",
      badgeClass: "bg-rose-100 text-rose-700 border-rose-200",
      text: isEnglish ? "Expired" : "Đã hết hạn",
    };
  } else if (daysLeft === 0) {
    return {
      daysLeft,
      colorClass: "text-red-500 font-semibold animate-pulse",
      badgeClass: "bg-red-500 text-white border-red-600",
      text: isEnglish ? "Expires today!" : "Hết hạn hôm nay!",
    };
  } else if (daysLeft === 1) {
    return {
      daysLeft,
      colorClass: "text-amber-500 font-medium",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      text: isEnglish ? "Expires tomorrow" : "Hết hạn ngày mai",
    };
  } else if (daysLeft <= 3) {
    return {
      daysLeft,
      colorClass: "text-amber-500 font-medium",
      badgeClass: "bg-amber-50/80 text-amber-700 border-amber-100",
      text: isEnglish ? `Expires in ${daysLeft} days` : `Hành trình ${daysLeft} ngày còn lại`,
    };
  } else {
    return {
      daysLeft,
      colorClass: "text-emerald-600 font-medium",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
      text: isEnglish ? `${daysLeft} days remaining` : `Còn hạn ${daysLeft} ngày`,
    };
  }
}
