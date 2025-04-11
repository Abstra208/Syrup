import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "@/popup/components/ThemeProvider";
import { setSetting, getSetting } from "@/lib/settings";
import { getLanguage, languageNames, languages, switchLanguage } from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react";
import { Link } from "lucide-react";

export default function Header({ pageIcon, pageDomain, couponsFound }: { pageIcon: string, pageDomain: string, couponsFound: number }) {
    const { theme } = useTheme();
    const { setTheme } = useTheme();
    const [language, setLanguage] = useState("en");
    const { t } = useTranslation();
    const updateLanguage = (lang: string): void => {
        setLanguage(lang);
        switchLanguage(lang);
    }
    useEffect(() => {
        getLanguage().then((lang: string) => {
            setLanguage(lang);
        });
    }, [])
    const [openAbout, setOpenAbout] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [dummyData, setDummyData] = useState<boolean | undefined>(undefined);
    const [showIcon, setShowIcon] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        getSetting("dummyData").then((data) => {
            setDummyData(data === "true");
        });
        getSetting("showIcon").then((data) => {
            setShowIcon(data === "true");
        });
    }, []);
    function updatedummyData(checked: boolean) {
        setSetting("dummyData", checked.toString());
        setDummyData(checked);
    }
    function updateshowIcon(checked: boolean) {
        setSetting("showIcon", checked.toString());
        setShowIcon(checked);
    }

    function share(button: string) {
        if (button === "link") {
            return () => {
                navigator.clipboard.writeText("https://chromewebstore.google.com/detail/syrup-open-beta/odfgjmajnbkiabjnfiijllkihjpilfch");
                toast("Link copied to the clipboard", {
                    action: {
                        label: "Share",
                        onClick: async () => {
                            if (navigator.share) {
                                try {
                                    await navigator.share({
                                        title: 'Syrup',
                                        text: 'Check out this free chrome extension',
                                        url: 'https://chromewebstore.google.com/detail/syrup-open-beta/odfgjmajnbkiabjnfiijllkihjpilfch',
                                    });
                                } catch (error) {
                                    console.error('Error sharing:', error);
                                }
                            } else {
                                console.log("Web Share API is not supported in your browser.");
                            }
                        },
                    },
                });
            };
        } else if (button === "email") {
            return () => window.open(`mailto:?subject=Check%20out%20this%20fantastic%20free%20Chrome%20extension%3A%20Syrup&body=🌟%20Check%20out%20this%20fantastic%20free%20Chrome%20extension%3A%20https%3A%2F%2Fchromewebstore.google.com%2Fdetail%2Fsyrup-open-beta%2Fodfgjmajnbkiabjnfiijllkihjpilfch%0A%0ASyrup%20makes%20it%20easy%20to%20find%20coupons%20online%2C%20helping%20you%20save%20money%20while%20you%20shop.%0A%0AYou%20can%20also%20visit%20their%20website%20for%20more%20information%3A%20https%3A%2F%2Fjoinsyrup.com.%0A%0AHappy%20shopping%20and%20saving!`);
        } else if (button === "discord") {
            return () => window.open("https://discord.gg/jxMDSTmS3E");
        }
    }

    function dialog(dialog: string) {
        if (dialog === "about") {
            return () => {
                setOpenAbout(true);
            };
        } else if (dialog === "settings") {
            return () => {
                setOpenSettings(true);
            };
        }
    }
    return (
        <>
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>Syrup</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={dialog("about")}>{t('about')}</MenubarItem>
                        <MenubarSeparator/>
                        <MenubarSub>
                            <MenubarSubTrigger>{t('share')}</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem onClick={share("link")}>{t('link')}</MenubarItem>
                                <MenubarItem onClick={share("email")}>{t('email')}</MenubarItem>
                                <MenubarItem onClick={share("discord")}>Discord</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSeparator/>
                        <MenubarItem onClick={dialog("settings")}>{t('settings')}</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>{t('theme')}</MenubarTrigger>
                    <MenubarContent>
                        <MenubarRadioGroup value={theme} onValueChange={setTheme}> {/* Igonre the error, it works */}
                            <MenubarRadioItem value="light">{t('light')}</MenubarRadioItem>
                            <MenubarRadioItem value="dark">{t('dark')}</MenubarRadioItem>
                            <MenubarRadioItem value="system">{t('system')}</MenubarRadioItem>
                        </MenubarRadioGroup>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>{t('language')}</MenubarTrigger>
                    <MenubarContent className="mr-4">
                        <input
                            type="text"
                            placeholder={t('search_lang')}
                            className="w-full p-2 mb-2 text-sm bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                            onClick={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onChange={(e) => {
                                e.preventDefault();
                                const searchValue = e.target.value.toLowerCase();
                                const items = document.querySelectorAll('.language-item');
                                items.forEach((item) => {
                                    const text = item.textContent?.toLowerCase() || '';
                                    if (text.includes(searchValue)) {
                                        (item as HTMLElement).style.display = '';
                                    } else {
                                        (item as HTMLElement).style.display = 'none';
                                    }
                                });
                            }}
                        />
                        <MenubarRadioGroup value={language} onValueChange={updateLanguage} className="overflow-y-scroll max-h-[12rem]">
                            {languages.map((lang) => (
                                <MenubarRadioItem className="language-item" value={lang}>{languageNames[lang]}</MenubarRadioItem>
                            ))}
                        </MenubarRadioGroup>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            { showIcon ? (
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Avatar className="size-[20px] rounded-md">
                                <AvatarImage src={pageIcon} alt="Page icon" />
                                <AvatarFallback>N/A</AvatarFallback>
                            </Avatar>
                        </MenubarTrigger>
                        <MenubarContent className="mr-4">
                            <MenubarItem>{pageDomain}</MenubarItem>
                            <MenubarItem>{t('coupons_found')}: {couponsFound}</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            ) : <></> }
            <Dialog open={openAbout} onOpenChange={setOpenAbout}>
                <DialogContent className="w-80 flex flex-col items-center rounded-lg">
                    <DialogHeader className="flex flex-row items-center gap-2">
                        <DialogTitle>{t('about')}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Syrup</h3>
                            <p className="text-muted-foreground">{t('version')} 1.6.0</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{t('principal_dev')}</h3>
                            <p className="text-muted-foreground flex flex-row">
                                <HoverCard>
                                    <HoverCardTrigger><a className="pr-2 hover:cursor-pointer">Hexium</a></HoverCardTrigger>
                                    <HoverCardContent>
                                        <div className="flex flex-row items-center gap-2">
                                            <Avatar>
                                                <AvatarImage src="https://github.com/Abdallah-Alwarawreh.png" alt="Hexium" />
                                                <AvatarFallback>Hexium</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h1>Hexium</h1>
                                                <p>Product Engineer @ open.cx</p>
                                                <div className="flex flex-row items-center gap-2 h-4 pt-1">
                                                    <Link size="12"/>
                                                    <a href="https://github.com/Abdallah-Alwarawreh" target="_blank">Github</a>
                                                </div>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                                <HoverCard>
                                    <HoverCardTrigger><a className="pr-2 hover:cursor-pointer">Abstra208</a></HoverCardTrigger>
                                    <HoverCardContent>
                                        <div className="flex flex-row items-center gap-2">
                                            <Avatar>
                                                <AvatarImage src="https://github.com/Abstra208.png" alt="Abstra208" />
                                                <AvatarFallback>Abstra208</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h1>Abstra208</h1>
                                                <p>Canadian student specializing in user interface and user experience for web development.</p>
                                                <div className="flex flex-row items-center gap-2 h-4 pt-1">
                                                    <Link size="12"/>
                                                    <a href="https://github.com/Abstra208" target="_blank">Github</a>
                                                </div>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                                <HoverCard>
                                    <HoverCardTrigger><a className="pr-2 hover:cursor-pointer">ImGajeed76</a></HoverCardTrigger>
                                    <HoverCardContent>
                                        <div className="flex flex-row items-center gap-2">
                                            <Avatar>
                                                <AvatarImage src="https://github.com/ImGajeed76.png" alt="ImGajeed76" />
                                                <AvatarFallback>ImGajeed76</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h1>ImGajeed76</h1>
                                                <p>Software engineer with experience in embedded systems, web apps, and game development.</p>
                                                <div className="flex flex-row items-center gap-2 h-4 pt-1">
                                                    <Link size="12"/>
                                                    <a href="https://github.com/ImGajeed76" target="_blank">Github</a>
                                                </div>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{t('contact')}</h3>
                            <p className="text-muted-foreground">Discord: https://discord.gg/jxMDSTmS3E</p>
                            <p className="text-muted-foreground">{t('website')}: https://joinsyrup.com</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{t('license')}</h3>
                            <p className="text-muted-foreground">GPL-3.0 {t('license')}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{t('copyright')}</h3>
                            <p className="text-muted-foreground">© 2024-25 Syrup group Inc. {t('all_rights_reserved')}.</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={openSettings} onOpenChange={setOpenSettings}>
                <DialogContent className="w-80 flex flex-col items-center rounded-lg">
                    <DialogHeader className="flex flex-row items-center gap-2">
                        <DialogTitle>{t('settings')}</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Switch id="show-icon" defaultChecked={showIcon} onCheckedChange={updateshowIcon} />
                        <label htmlFor="show-icon">{t('show_website_icon')}</label>
                        <p>{t('show_website_icon_desc')}</p>
                    </div>
                    <div>
                        <Switch defaultChecked={dummyData} onCheckedChange={updatedummyData} id="dummy-data"/>
                        <label htmlFor="dummy-data">{t('dummy_data')}</label>
                        <p>{t('dummy_data_desc')} {t('dev')}</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}