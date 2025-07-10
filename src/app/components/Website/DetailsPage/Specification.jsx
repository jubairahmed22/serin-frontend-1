import React from 'react';
import AuthorProfile from '../../../components/Website/DetailsPage/AuthorProfile'

const Specification = ({ product }) => {
  // Sample data structure if product.specifications isn't provided
  const specifications =  [
    { name: 'Book Name', value: product.title },
    { name: 'Publisher Name', value: product.publisher.name },
    { name: 'Edition', value: product.edition },
    { name: 'Number Of Pages', value: product.numberOfPages },
    { name: 'Language', value: product.language },
    { name: 'Country', value: product.country },
    { name: 'Weight', value: product.weight },
  ];

  return (
    <div className='flex flex-row gap-5'>
        <div className="product-specifications w-[60%] fontPoppins border border-[#E6E6E6] rounded-xl">
      <h3 className='px-6 py-4'>Books Specifications</h3>
      <div className="specifications-table">
        {specifications.map((spec, index) => (
          <div 
            key={index} 
            className="spec-row px-6"
            style={{ 
              display: 'flex',
              borderBottom: '1px solid #E6E6E6',
              padding: '12px 0',
              backgroundColor: index % 2 === 0 ? 'rgba(153, 153, 153, 0.1)' : 'transparent'
            }}
          >
            <div 
              className="spec-name px-6" 
              style={{
                width: '30%',
                fontWeight: '600',
                color: '#333',
                paddingRight: '15px'
              }}
            >
              {spec.name}
            </div>
            <div 
              className="spec-value px-6" 
              style={{
                width: '70%',
                color: '#666'
              }}
            >
              {spec.value}
            </div>
          </div>
        ))}
      </div>
    </div>
     <div className='w-[40%] rounded-xl border border-[#E6E6E6]  p-5'>
         <AuthorProfile product={product}></AuthorProfile>
     </div>
     
    </div>
  );
};

export default Specification;