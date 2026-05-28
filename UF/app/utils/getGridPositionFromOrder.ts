  // Function to convert order number to grid position (dynamically calculated)
  export const getGridPositionFromOrder = (order: number) => {
    if (!order || order < 1) {
      return { gridColumn: '1 / 4', gridRow: '1 / 12' }; // Default to position 1
    }

    // Calculate grid position dynamically
    // Pattern: ALL buttons span 3 columns
    // Order 1: 1/4, Order 2: 4/7, Order 3: 7/10, Order 4: 10/13, etc.
    const columnStart = 1 + (order - 1) * 3;
    const columnEnd = columnStart + 3;

    return {
      gridColumn: `${columnStart} / ${columnEnd}`,
      gridRow: '1 / 12'
    };
  };