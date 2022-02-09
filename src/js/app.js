import DnD from './dnd';
import Record from './record';
import Organizer from './organizer';
import Server from './server';
import Geo from './geolocation';

console.log('app started');

const server = new Server();
const geo = new Geo();
const record = new Record(server);
const dnd = new DnD(server);
const organizer = new Organizer(server);

geo.events();
record.events();
dnd.events();
organizer.events();
