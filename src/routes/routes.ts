import { LazyExoticComponent } from "react";
import { Create, Home, Items, Purchases } from "../components/Pages";

type JSXComponent = () => JSX.Element;

interface Route {
    to: string,
    path: string,
    Component: LazyExoticComponent<JSXComponent> | JSXComponent;
    name: string,
}

export const routes: Route[] = [
    {
        path: '/', //Indicamos este es parte de la ruta, y todo el que venga despues de ella es procesada por esta
        to: '/',
        Component: Home,
        name: 'Home'
    },
    {
        path: '/create', 
        to: '/create',
        Component: Create,
        name: 'Create'
    },
    {
        path: '/items', 
        to: '/items',
        Component: Items,
        name: 'Items'
    },
    {
        path: '/purchases', 
        to: '/purchases',
        Component: Purchases,
        name: 'Purchases'
    },
]