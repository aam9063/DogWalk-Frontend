
const facturaService = {
  descargarFacturaPdf: async (facturaId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Factura/${facturaId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al descargar la factura');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${facturaId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar la factura:', error);
      throw error;
    }
  }
};

export default facturaService; 