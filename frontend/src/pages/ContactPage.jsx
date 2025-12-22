import ChatContainer from "@/components/contact/ChatContainer";
import ContactList from "@/components/contact/ContactList";
import { Info, MoreHorizontal } from "lucide-react";


const ContactPage = () => {
  return (

    <div className="flex items-center justify-center w-full h-screen md:p-4 ">


      <div className="w-full h-full max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl 
                      flex  bg-accent/50 dark:bg-foreground/1 rounded-none md:rounded-lg  md:border-1 border-muted">
        <div className="w-1/3">
            <ContactList/>
        </div>
        <ChatContainer/>
      </div>
    </div>
  )
}

export default ContactPage;