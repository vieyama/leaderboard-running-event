// Extend the Window interface to include the route function
declare global {
    interface Window {
        route: (name: string, params?: any, absolute?: boolean) => string;
    }
}

// This is a TypeScript-friendly wrapper around Laravel's route function
export function route(name: string, params?: any, absolute?: boolean): string {
    if (typeof window.route !== 'function') {
        throw new Error('Laravel route helper is not available. Make sure the Ziggy route helper is included.');
    }
    return window.route(name, params, absolute);
}

export default route;
