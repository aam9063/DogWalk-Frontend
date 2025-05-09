import React from 'react';
import { FaDog, FaCarrot, FaBone, FaTag, FaPumpSoap, FaFirstAid, FaTshirt } from 'react-icons/fa';

const FilterTree = ({ categorias, selectedCategories, onCategoryChange }) => {
  // Mapear los iconos según la categoría
  const getCategoryIcon = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case 'juguete':
        return <FaDog className="text-dog-green" />;
      case 'alimentacion':
        return <FaCarrot className="text-dog-green" />;
      case 'snack':
        return <FaBone className="text-dog-green" />;
      case 'accesorio':
        return <FaTag className="text-dog-green" />;
      case 'higiene':
        return <FaPumpSoap className="text-dog-green" />;
      case 'salud':
        return <FaFirstAid className="text-dog-green" />;
      case 'ropa':
        return <FaTshirt className="text-dog-green" />;
      default:
        return <FaDog className="text-dog-green" />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Categorías</h2>
      
      <div className="space-y-4">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="flex items-center">
            <input
              type="checkbox"
              id={`categoria-${categoria.id}`}
              checked={selectedCategories.includes(categoria.id)}
              onChange={() => onCategoryChange(categoria.id)}
              className="w-5 h-5 rounded form-checkbox text-dog-green"
            />
            <label
              htmlFor={`categoria-${categoria.id}`}
              className="flex items-center ml-2 cursor-pointer"
            >
              <span className="mr-2">{getCategoryIcon(categoria.nombre)}</span>
              <span>{categoria.nombre}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterTree; 