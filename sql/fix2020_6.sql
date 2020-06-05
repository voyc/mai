/*
4 jun 2020
select d.id, m.id, t, e from mai.dict d, mai.mean m where d.id = m.did and d.id in (1503, 1506, 1508, 1501, 1512, 1537, 1539, 1542, 1543);
delete from mai.dict d where d.id in (1503, 1506, 1508, 1501, 1512, 1537, 1539, 1542, 1543);
delete from mai.mean m where m.did in (1503, 1506, 1508, 1501, 1512, 1537, 1539, 1542, 1543);

update mai.mean set p='v' where did = 1516;
update mai.mean set p='v'  where did = 1517;
update mai.mean set p='vj' where did = 1507;
update mai.mean set p='i'  where did = 1597;

delete from mai.dict where id = 1629;
delete from mai.mean where id in (762,764);
*/
