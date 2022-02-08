import DnD from './dnd';
import Record from './record';
import Organizer from './organizer';
import Server from './server';

console.log('app started');

const server = new Server();
const record = new Record(server);
const dnd = new DnD(server);
const organizer = new Organizer(server);

record.events();
dnd.events();
organizer.events();
