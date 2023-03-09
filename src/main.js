import FiltersView from './view/filters.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import SiteMenuView from './view/site-menu.js';
import { render } from './render.js';
import RoutePointsModel from './model/route-point-model.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');

const tripPresenter = new TripEventsPresenter(siteMainElement.querySelector('.trip-events'));
const routePointModel = new RoutePointsModel();

render(new FiltersView(), siteHeaderElement.querySelector('.trip-controls__filters'));
render(new SiteMenuView(), siteHeaderElement.querySelector('.trip-controls__navigation'));

tripPresenter.init(routePointModel);
