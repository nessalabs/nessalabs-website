---- MODULE SearchTimer ----
EXTENDS Naturals, FiniteSets
VARIABLES current, timers, mounted, published, firedOwner, ownerAtFire, mountedAtFire
vars == <<current,timers,mounted,published,firedOwner,ownerAtFire,mountedAtFire>>
Init == /\ current = 0 /\ timers = {} /\ mounted = TRUE /\ published = FALSE /\ firedOwner = 0 /\ ownerAtFire = 0 /\ mountedAtFire = TRUE
Edit == /\ mounted /\ current < 2 /\ current' = current + 1
        /\ timers' = {current + 1} /\ UNCHANGED <<mounted,published,firedOwner,ownerAtFire,mountedAtFire>>
Retire == /\ mounted /\ mounted' = FALSE /\ timers' = {} /\ UNCHANGED <<current,published,firedOwner,ownerAtFire,mountedAtFire>>
Fire == \E owner \in timers:
        /\ published' = TRUE /\ firedOwner' = owner /\ ownerAtFire' = current /\ mountedAtFire' = mounted
        /\ timers' = timers \ {owner} /\ UNCHANGED <<current,mounted>>
Next == Edit \/ Retire \/ Fire
LatestTimerOnly == published => firedOwner = ownerAtFire
NoRetiredCallback == published => mountedAtFire
====
