'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Split Air Conditioner 1.5 Ton',
        description: 'Energy efficient split AC with cooling capacity of 1.5 ton, perfect for medium rooms.',
        price: 450.00,
        category: 'Air Conditioning',
        image: 'Split Air Conditioner 1.5 Ton.jpg',
        stock: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Window Air Conditioner 1 Ton',
        description: 'Compact window AC unit with 1 ton cooling capacity, ideal for small rooms.',
        price: 320.00,
        category: 'Air Conditioning',
        image: 'Window Air Conditioner 1 Ton.jpg',
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kitchen Sink Faucet',
        description: 'Stainless steel kitchen faucet with pull-out spray and ceramic disc valves.',
        price: 85.00,
        category: 'Plumbing',
        image: 'Kitchen Sink Faucet.jpg',
        stock: 40,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bathroom Shower Set',
        description: 'Complete shower set with rainfall showerhead and handheld shower.',
        price: 120.00,
        category: 'Plumbing',
        image: 'Bathroom Shower Set.jpg',
        stock: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fire Extinguisher 5kg',
        description: 'ABC dry powder fire extinguisher, suitable for all types of fires.',
        price: 35.00,
        category: 'Fire Fighting',
        image: 'Fire Extinguisher 5kg.jpg',
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Smoke Detector',
        description: 'Battery operated smoke detector with loud alarm and test button.',
        price: 25.00,
        category: 'Fire Fighting',
        image: 'Smoke Detector.jpg',
        stock: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Central Air Conditioning Unit',
        description: 'High capacity central AC system for large buildings and offices.',
        price: 1200.00,
        category: 'Air Conditioning',
        image: 'Central Air Conditioning Unit.jpg',
        stock: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Water Heater 50L',
        description: 'Electric water heater with 50 liter capacity and temperature control.',
        price: 180.00,
        category: 'Plumbing',
        image: 'Water Heater 50L.png',
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};