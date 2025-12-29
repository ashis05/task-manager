import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator} from "@/components/ui/dropdown-menu.tsx";
import {useEffect, useState} from "react";
import {CirclePlus} from "lucide-react";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.tsx";
import axios from "axios";
import {useTagStore} from "@/store/tagStore.ts";


const PRESET_COLORS = [
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#3b82f6", "#a855f7", "#ec4899", "#64748b",
];

interface TaskTagsProps {
    onTagsChange?: (tag_ids: string[]) => void;
    initialTags?: Tag[];
}

function TaskTags({onTagsChange, initialTags = []}: TaskTagsProps) {

    const {availableTags, setAvailableTags} = useTagStore();
    const [selectedColor, setSelectedColor] = useState<string>("#ef4444");
    const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags);
    const [tagName, setTagName] = useState<string>("");
    const [trigger, setTrigger] = useState<boolean>();

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('/api/getTags', {headers: {'Authorization': `Bearer ${token}`}}).then((res) => {
            setAvailableTags(res.data);
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setTrigger(false);
        });
    }, [trigger]);

    useEffect(() => {
        if (initialTags.length > 0) {
            setSelectedTags(initialTags);
        }
    }, [initialTags]);

    useEffect(() => {
        if (onTagsChange) {
            onTagsChange(selectedTags.map((tag) => tag.tag_id));
        }
    }, [selectedTags, onTagsChange]);

    const createTag = async (name: string, color: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/createTag', {name, color}, {headers: {'Authorization': `Bearer ${token}`}});
            setTrigger(true);
        } catch (error) {
            console.error(error);
            alert("Error Creating Tag");
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <InputGroup className="border-[#92a4c9]">
                    <InputGroupInput type="text" placeholder={`${selectedTags.length === 0 ? "Add Tags" : ""} `}
                                     readOnly/>
                    {selectedTags.length > 0 && (
                        <InputGroupAddon>
                            {selectedTags.map((tag) => (
                                <div key={tag.tag_id}
                                     className="text-white h-auto w-auto rounded-full flex justify-center items-center px-2 py-0.5"
                                     style={{backgroundColor: tag.color}}>
                                    {tag.name}
                                </div>
                            ))}
                        </InputGroupAddon>
                    )}
                </InputGroup>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="text-white bg-[#1a2230] border-[#92a4c9] border-2 w-[200px] rounded-xl py-2">
                <DropdownMenuLabel className="h-10 flex items-center">Tags</DropdownMenuLabel>
                {availableTags.map((tag) => (
                    <DropdownMenuCheckboxItem
                        key={tag.tag_id}
                        className="text-white hover:bg-[#92a4c9] h-10 flex items-center cursor-pointer"

                        // 1. Check if the tag ID exists in the selected array
                        checked={selectedTags.some((t) => t.tag_id === tag.tag_id)}

                        // 2. Add or Remove based on the 'isChecked' boolean
                        onCheckedChange={(isChecked) => {
                            setSelectedTags((prev) =>
                                isChecked
                                    ? [...prev, tag] // Add tag
                                    : prev.filter((t) => t.tag_id !== tag.tag_id) // Remove tag
                            );
                        }}
                    >
                        {/* Render the Name (not the object) */}
                        {tag.name}
                        <div className="w-full flex justify-end">
                            <div className={`rounded-full size-5 mr-2 border-2 border-black`}
                                 style={{backgroundColor: tag.color}}></div>
                        </div>
                    </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator className="bg-[#3b5975] w-auto mx-2 rounded-xl h-px"/>
                <DropdownMenuLabel className="h-10 flex items-center">Create Tag</DropdownMenuLabel>
                <div className="flex flex-row gap-1 mx-2">
                    {PRESET_COLORS.map((color) => (
                        <button key={color} type="button"
                                className={`w-5 h-5 rounded-full transition-all ${selectedColor === color ? "border-white border-2" : "border-black border-1"}`}
                                style={{background: color}} onClick={() => setSelectedColor(color)}></button>
                    ))}
                </div>
                <div className="flex mt-2">
                    <InputGroup
                        className="mx-2 gap-1 border-[#92a4c9] h-8 rounded-md flex items-center overflow-hidden">
                        <InputGroupInput
                            type="text"
                            placeholder="Tag Name"
                            className="ml-1.5 border-none w-full text-left bg-transparent focus:outline-none h-full"
                            onChange={(e) => setTagName(e.target.value)}
                        />
                        <InputGroupAddon align="inline-end" className="h-full">
                            <button
                                type="button"
                                className="h-full bg-[#1a2230] hover:bg-[#92a4c9] hover:text-[#1a2230] text-[#92a4c9] rounded-full px-3 flex items-center gap-2 size-auto"
                                disabled={tagName.length === 0}
                                onClick={(e) => {
                                    e.preventDefault(); // Stop any weird form submission
                                    console.log("Button Clicked!"); // <--- DOES THIS SHOW UP?
                                    console.log("Name:", tagName, "Color:", selectedColor);

                                    createTag(tagName, selectedColor);
                                }}
                            >
                                <CirclePlus className="size-4"/>
                            </button>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default TaskTags;