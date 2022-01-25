import Organizer from './organizer';
import Server from './server';

console.log('app started');

const server = new Server();
const organizer = new Organizer(server);

organizer.events();
