const Benefits = () => {
  const benefitsList = [
    {
      icon: "/icons/person_check_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Miles de opiniones positivas"
    },
    {
      icon: "/icons/verified_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Cancelación gratuita"
    },
    {
      icon: "/icons/stethoscope_check_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Cobertura veterinaria"
    },
    {
      icon: "/icons/sms_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Contacto en todo momento con el cuidador"
    },
    {
      icon: "/icons/credit_score_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Pago seguro con Stripe"
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container px-4 mx-auto">
        <h2 className="mb-12 text-3xl text-center font-adlam">Seguridad y Beneficios de Dog Walk</h2>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {benefitsList.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-white border border-gray-300 rounded-full">
                <img src={benefit.icon} alt={`Beneficio ${index + 1}`} className="w-8 h-8" />
              </div>
              <p className="text-sm text-gray-600">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits; 