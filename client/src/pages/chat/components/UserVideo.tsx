import { useUserMedia } from 'pages/chat/hooks/useUserMedia'

type Props = React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>

export const UserVideo: React.FC<Props> = (props) => {
  const { videoRef, status } = useUserMedia()

  return (
    <>
      {status === 'requesting-access' ? 'Loading...' : null}
      <video ref={videoRef} autoPlay playsInline muted={true} {...props} />
    </>
  )
}
