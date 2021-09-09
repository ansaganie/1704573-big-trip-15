class OffersAdapter {
  static adaptServerToClient(offers) {
    return offers.reduce(
      (acc, offer) => ({ ...acc, [offer.type]: offer.offers }),
      {},
    );
  }
}

export default OffersAdapter;
