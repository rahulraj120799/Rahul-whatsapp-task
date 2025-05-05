import ReactDOM from 'react-dom';

const PhotoPicker = ({ onChange }: { onChange: (e: any) => void }) => {
  const componenent = (
    <input type="file" hidden id="photo-picker" onChange={onChange} />
  );
  return ReactDOM.createPortal(
    componenent,
    document.getElementById('photo-picker-element') as any
  );
};

export default PhotoPicker;
