import ApiService from '../framework/api-service.js';
import { ApiServiceResponseMethod } from '../const.js';

export default class PlacesApiService extends ApiService {
  #adaptToServer = (point) => {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  };

  async _loadPoint(url, method = ApiServiceResponseMethod.GET, body = null) {
    const options = {
      method: method,
      headers: new Headers({'Content-Type': 'application/json'}),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await this._load({ url, ...options });

    return ApiService.parseResponse(response);
  }

  get points() {
    return this._loadPoint('points');
  }

  updatePoint = async (point) => {
    return this._loadPoint(`points/${point.id}`, ApiServiceResponseMethod.PUT, this.#adaptToServer(point));
  };

  addPoint = async (point) => {
    return this._loadPoint('points', ApiServiceResponseMethod.POST, this.#adaptToServer(point));
  };

  deletePoint = async (point) => {
    return this._loadPoint(`points/${point.id}`, ApiServiceResponseMethod.DELETE);
  };
}
