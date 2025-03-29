export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23", // Use 24-hour clock format
  };

  // Format the date without milliseconds
  const formattedDate = date.toLocaleString("en-US", options);

  // Extract milliseconds and append them to the formatted string
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  return `${formattedDate}.${milliseconds}`;
}