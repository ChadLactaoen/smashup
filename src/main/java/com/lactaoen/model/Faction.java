package com.lactaoen.model;

public enum Faction {
    ALIENS(1, "Aliens", Set.CORE, "89adcd"),
    BEAR_CAVALRY(2, "Bear Cavalry", Set.AWESOME_LEVEL_9000, "7a5646"),
    CYBORG_APES(3, "Cyborg Apes", Set.SCIENCE_FICTION_DOUBLE_FEATURE, "fedd67"),
    DINOSAURS(4, "Dinosaurs", Set.CORE, "a98563"),
    DRAGONS(5, "Dragons", Set.ITS_YOUR_FAULT, "c34628"),
    FAIRIES(6, "Fairies", Set.PRETTY_PRETTY_SMASH_UP, "f2c4d3"),
    GEEKS(7, "Geeks", Set.BIG_GEEKY_BOX, "dbdbdb"),
    GHOSTS(8, "Ghosts", Set.AWESOME_LEVEL_9000, "b3c8d5"),
    GIANT_ANTS(9, "Giant Ants", Set.MONSTER_SMASH, "e6dada"),
    KILLER_PLANTS(10, "Killer Plants", Set.AWESOME_LEVEL_9000, "a6bf65"),
    KITTY_CATS(11, "Kitty Cats", Set.PRETTY_PRETTY_SMASH_UP, "c8cae0"),
    MAD_SCIENTISTS(12, "Mad Scientists", Set.MONSTER_SMASH, "caad85"),
    MYTHIC_GREEKS(13, "Mythic Greeks", Set.ITS_YOUR_FAULT, "c05f3e"),
    MYTHIC_HORSES(14, "Mythic Horses", Set.PRETTY_PRETTY_SMASH_UP, "d7dbe4"),
    NINJAS(15, "Ninjas", Set.CORE, "2a3046"),
    PIRATES(16, "Pirates", Set.CORE, "c5b09b"),
    PRINCESSES(17, "Princesses", Set.PRETTY_PRETTY_SMASH_UP, "feea85"),
    ROBOTS(18, "Robots", Set.CORE, "7d7777"),
    SHAPESHIFTERS(19, "Shapeshifters", Set.SCIENCE_FICTION_DOUBLE_FEATURE, "f39295"),
    SHARKS(20, "Sharks", Set.ITS_YOUR_FAULT, "16a0ad"),
    STEAMPUNKS(21, "Steampunks", Set.AWESOME_LEVEL_9000, "efe4d1"),
    SUPER_HEROES(22, "Super Heroes", Set.ITS_YOUR_FAULT, "1482c3"),
    SUPER_SPIES(23, "Super Spies", Set.SCIENCE_FICTION_DOUBLE_FEATURE, "fae9cd"),
    TIME_TRAVELLERS(24, "Time Travellers", Set.SCIENCE_FICTION_DOUBLE_FEATURE, "70b2a8"),
    TORNADOS(25, "Tornados", Set.ITS_YOUR_FAULT, "8d827c"),
    TRICKSTERS(26, "Tricksters", Set.CORE, "75ac58"),
    VAMPIRES(27, "Vampires", Set.MONSTER_SMASH, "c03c42"),
    WEREWOLVES(28, "Werewolves", Set.MONSTER_SMASH, "af9c85"),
    WIZARDS(29, "Wizards", Set.CORE, "844b9c"),
    ZOMBIES(30, "Zombies", Set.CORE, "c8e09a");

    private final int factionId;
    private final String name;
    private final Set set;
    private final String color;

    Faction(int factionId, String name, Set set, String color) {
        this.factionId = factionId;
        this.name = name;
        this.set = set;
        this.color = color;
    }

    public int getFactionId() {
        return factionId;
    }

    public String getName() {
        return name;
    }

    public Set getSet() {
        return set;
    }

    public String getColor() {
        return color;
    }
}

