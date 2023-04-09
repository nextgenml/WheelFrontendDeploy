export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
export function similarity(str1, str2) {
  var len1 = str1.length;
  var len2 = str2.length;
  var matrix = [];

  // Initialize the matrix
  for (var i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (var j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill in the matrix
  for (var i = 1; i <= len1; i++) {
    for (var j = 1; j <= len2; j++) {
      if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }

  // Return the similarity score
  return 1 - matrix[len1][len2] / Math.max(len1, len2);
}
