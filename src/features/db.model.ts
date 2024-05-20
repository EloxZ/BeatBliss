import Dexie, { Table } from 'dexie';

export interface Song {
  id?: number
  title: string
  artist: string
  duration: number
  name: string
  data: string
}

export class DB extends Dexie {
  song!: Table<Song>
  constructor() {
    super('BeatBlissDatabase')
    this.version(1).stores({
        song: '++id, title, artist, duration, name, data'  
    })
  }
}

export const db = new DB()