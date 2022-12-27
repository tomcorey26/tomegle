import { useVideoStream } from '../hooks/useVideoStream'

type VideoProps = {
  stream?: MediaStream
  className?: string
}

export const ChatVideo: React.FC<VideoProps> = ({ stream, className = '' }) => {
  const videoRef = useVideoStream(stream)

  return (
    <video
      className={`object-cover ${className}`}
      ref={videoRef}
      autoPlay
      playsInline
      muted={!stream}
    />
  )
}
