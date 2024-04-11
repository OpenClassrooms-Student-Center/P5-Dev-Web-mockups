const uuid = require('uuid/v1');
const Product = require('../models/Product');

exports.getAllProducts = (req, res, next) => {
  Product.find().then(
    (products) => {
      const mappedProducts = products.map((product) => {
        product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
        return product;
      });
      res.status(200).json(mappedProducts);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  );
};

exports.getOneProduct = (req, res, next) => {
  Product.findById(req.params.id).then(
    (product) => {
      if (!product) {
        return res.status(404).send(new Error('Product not found!'));
      }
      product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
      res.status(200).json(product);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  )
};

/**
 *
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */
exports.orderProducts = (req, res, next) => {
  if (!req.body.contact ||
      !req.body.contact.firstName ||
      !req.body.contact.lastName ||
      !req.body.contact.address ||
      !req.body.contact.city ||
      !req.body.contact.email ||
      !req.body.products) {
    return res.status(400).send(new Error('Bad request!'));
  }
  let queries = [];
  for (let productId of req.body.products) {
    const queryPromise = new Promise((resolve, reject) => {
      Product.findById(productId).then(
        (product) => {
          if (!product) {
            reject('Product not found: ' + productId);
          }
          product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
          resolve(product);
        }
      ).catch(
        () => {
          reject('Database error!');
        }
      )
    });
    queries.push(queryPromise);
  }
  Promise.all(queries).then(
    (products) => {
      const orderId = uuid();
      return res.status(201).json({
        contact: req.body.contact,
        products: products,
        orderId: orderId
      })
    }
  ).catch(
    (error) => {
      return res.status(500).json(new Error(error));
    }
  );
};
