import { render } from './framework/render.js';
import FilterPresenter from './presenter/filter.js';
import BoardPresenter from './presenter/board.js';
import NewPointButtonPresenter from './presenter/new-point-button.js';
import SiteMenuView from './view/menu-view.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import PlacesApiService from './api-service/places-api-service.js';
import DealsApiService from './api-service/deals-api-service.js';
import TravelsApiService from './api-service/travels-api-service.js';
import { API, VERIFICATION } from './const.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');

const pointsModel = new PointsModel(new PlacesApiService(API, VERIFICATION));
const destinationsModel = new DestinationsModel(new DealsApiService(API, VERIFICATION));
const offersModel = new OffersModel(new TravelsApiService(API, VERIFICATION));

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter({
  filterContainer: siteHeaderElement.querySelector('.trip-controls__filters'),
  pointsModel,
  filterModel
});
filterPresenter.init();

const boardPresenter = new BoardPresenter({
  tripInfoContainer: siteHeaderElement.querySelector('.trip-main__trip-info'),
  tripContainer: siteMainElement.querySelector('.trip-events'),
  pointsModel,
  filterModel,
  destinationsModel,
  offersModel
});
boardPresenter.init();

const newPointButtonPresenter = new NewPointButtonPresenter({
  newPointButtonContainer: siteHeaderElement,
  destinationsModel,
  offersModel,
  boardPresenter
});

newPointButtonPresenter.init();

Promise.all([
  offersModel.init(),
  destinationsModel.init(),
  pointsModel.init()
]).finally(() => {
  newPointButtonPresenter.renderNewPointButton();
});

render(new SiteMenuView(), siteHeaderElement.querySelector('.trip-controls__navigation'));
