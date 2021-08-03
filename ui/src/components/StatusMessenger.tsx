import * as React from "react";

type Message = {
  styleClass: string;
  text: string;
};
const messages: Message[] = [];

// supposed to be a singleton
let compInstance: StatusMessenger | null;

export function AddMessage(styleClass: string, messageText: string, displayTime = 7500): void {
  if(!compInstance) {
    console.warn("StatusMessenger not initalised");
    return;
  }

  const msg = {styleClass, text: messageText};

  messages.push(msg);
  if(messages.length > 5) messages.shift();
  compInstance.forceUpdate();

  setTimeout(() => {
    const ind = messages.indexOf(msg);
    if(ind == -1) return;

    messages.splice(ind, 1);
    compInstance!.forceUpdate();
  }, displayTime);
}


const StatusMessage: React.FC<{message: Message}> = ({message: {styleClass, text}}) =>
  (<div className={"p-3 my-8 rounded text-center text-lg font-bold "+styleClass}>
    {text}
  </div>);

// no props
type Props = Record<string, never>;
export class StatusMessenger extends React.Component<Props> {
  constructor(props: Props){
    super(props);
    compInstance = this;
  }

  render(): React.ReactNode {
    return (<div className="fixed bottom-0 max-w-md w-full inset-x-0 mx-auto text-center px-8">
      {messages.map((m, i) => <StatusMessage key={i} message={m} />)}
    </div>);
  }
}