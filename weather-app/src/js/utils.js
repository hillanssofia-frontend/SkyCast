function formatTemperature(temp) {
    return `${Math.round(temp)}°C`;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export { formatTemperature, formatDate };