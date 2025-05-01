const Benefits = () => {
  const benefitsList = [
    {
      icon: "/icons/person_check_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      icon: "/icons/verified_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      icon: "/icons/stethoscope_check_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      icon: "/icons/sms_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      icon: "/icons/credit_score_FILL0_wght400_GRAD0_opsz24.svg",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-adlam text-center mb-12">Seguridad y Beneficios de Dog Walk</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {benefitsList.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center mb-4 bg-white">
                <img src={benefit.icon} alt={`Beneficio ${index + 1}`} className="w-8 h-8" />
              </div>
              <p className="text-gray-600 text-sm">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits; 