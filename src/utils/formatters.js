/**
 * Format seconds into MM:SS display format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string (MM:SS)
 */
export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  /**
   * Get color based on score value
   * @param {number} score - Score value (0-100)
   * @returns {string} Color code for the score
   */
  export const getScoreColor = (score) => {
    return score > 80 ? "green.500" : score > 60 ? "yellow.500" : "red.500";
  };