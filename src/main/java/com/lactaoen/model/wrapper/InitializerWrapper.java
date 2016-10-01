package com.lactaoen.model.wrapper;

import com.lactaoen.model.Base;

import java.util.List;

public class InitializerWrapper {

    private List<Base> bases;
    private List<InitialFactionWrapper> factions;

    public InitializerWrapper() {
    }

    public List<Base> getBases() {
        return bases;
    }

    public void setBases(List<Base> bases) {
        this.bases = bases;
    }

    public List<InitialFactionWrapper> getFactions() {
        return factions;
    }

    public void setFactions(List<InitialFactionWrapper> factions) {
        this.factions = factions;
    }
}
