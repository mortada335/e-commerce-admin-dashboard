

import "@blocknote/mantine/style.css";
import { cn } from "@/lib/utils"
import useTheme from "../../context/theme/useTheme";
import { BlockNoteView } from "@blocknote/mantine";
import {

    useCreateBlockNote,
  } from "@blocknote/react";
export const Editor = ({
    onChange,
    initialContent,
    editable,
    className,
    containerClassName
})=>{
    // const {edgestore} = useEdgeStore()
    const {theme}=useTheme()

    const getInitialContent = () =>{
      try{
      return initialContent?JSON.parse(initialContent):undefined
      }catch(error){
        // console.log(error)
    }

      
    } 
// Creates a new editor instance.
    const editor=useCreateBlockNote({
      
          // Sets attributes on DOM elements in the editor.
    domAttributes: {
        // Adds a class to all `blockContainer` elements.
        block: {
          class: cn("h-[100px] py-2",initialContent&&'h-fit',className),
        },
      },
        initialContent:getInitialContent(),
        
    })




    const handleOnChange = ()=>{

      if (editable) {
        try {
          onChange(JSON.stringify(editor.document));
        } catch (error) {
          console.error("Error during content change:", error);
        }
      }
  

}

const currentTheme = theme === "dark" ? "dark" : "light";

// Renders the editor instance using a React component.
    return(
      <div
      className={cn(
        "border rounded-md h-fit w-full",
        containerClassName,
        !editable && "pointer-events-none select-none" // Disable interaction styles
      )}
    >
      <BlockNoteView
        editable={editable}
        editor={editor}
        onChange={editable ? handleOnChange : undefined} // Disable onChange when not editable
        theme={currentTheme}
      />
    </div>
    )

}

Editor.defaultProps = {
  initialContent: null,
  editable: true,
  className: "",
  containerClassName: "",
};