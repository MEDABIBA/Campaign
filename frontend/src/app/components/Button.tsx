import { CSSProperties } from "react";
import { Loader } from "semantic-ui-react";

type ButtonProps = {
  isPending: boolean;
  inscription: string;
  style?: CSSProperties;
};

export default function Button({ isPending, inscription, style }: ButtonProps) {
  return (
    <button className="ui primary button" style={style}>
      {isPending ? <Loader active inline size="mini" /> : inscription}
    </button>
  );
}
