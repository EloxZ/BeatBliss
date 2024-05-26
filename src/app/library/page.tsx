
import SongDropzone from '@/components/songs/SongDropzone'
import SongList from '@/components/songs/SongList'

export default function Library() {
    return <main className="max-w-[1000px] mx-auto">
        <h1 className="text-3xl mb-4">Upload and manage your songs</h1>
        <SongDropzone/>
        <div className='h-16'></div>
        <SongList/>
    </main>
}
