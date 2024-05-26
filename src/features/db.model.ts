import Dexie, { Table } from 'dexie';

export interface Song {
  id?: number
  title: string
  artist: string
  duration: number
  name: string
  data: string
}

export interface Playlist {
  id?: number
  name: string
  songIds: number[];
}

export class DB extends Dexie {
  song!: Table<Song>
  playlist!: Table<Playlist>
  constructor() {
    super('BeatBlissDatabase')
    this.version(1).stores({
        song: '++id, title, artist, duration, name, data',
        playlist: '++id, name, songIds',
    })
  }

  async addSongToPlaylist(songId: number, playlistId: number) {
    const playlist = await this.playlist.get(playlistId);
    if (playlist) {
      if (!playlist.songIds.includes(songId)) {
        playlist.songIds.push(songId)
        await this.playlist.put(playlist)
      }
    }
  }

  async removeSongFromPlaylist(songId: number, playlistId: number) {
    const playlist = await this.playlist.get(playlistId);
    if (playlist) {
      playlist.songIds = playlist.songIds.filter(id => id !== songId)
      await this.playlist.put(playlist);
    }
  }

  async getSongsInPlaylist(playlistId: number): Promise<Song[]> {
    const playlist = await this.playlist.get(playlistId);
    if (playlist) {
      const songPromises: Promise<Song | undefined>[] = playlist.songIds.map(id => this.song.get(id))
      const songs = await Promise.all(songPromises)
      return songs.filter((song): song is Song => song !== undefined)
    }
    return [];
  }
}

export const db = new DB()