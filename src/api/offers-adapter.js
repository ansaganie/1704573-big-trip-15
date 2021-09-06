class OffersAdapter {
  static adaptServerToClient(offers) {
    return offers.reduce(
      (obj, offer) => ({ ...obj, [offer.type]: offer.offers }),
      {},
    );
  }
}

export default OffersAdapter;
